export default (ngModule) => {
    describe('Table component', () => {

        let $compile, directiveElem, directiveCtrl, $scope, state, parentElement, PaginationModel, model;

        beforeEach(window.module(ngModule.name));
        beforeEach(inject(function(_$compile_, _$rootScope_, _$state_, _PaginationModel_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();

            state = _$state_;
            PaginationModel = _PaginationModel_;
            spyOn( state, 'go');
            spyOn( state, 'transitionTo');

            directiveElem = getCompiledElement();
            directiveCtrl = directiveElem.controller('ttmdPagination');
        }));


        it('should have the controller defined', () => {
            expect(directiveCtrl).toBeDefined();
        });

        it('should have the parent controller defined', () => {
            expect(directiveCtrl.listCtrl).toBeDefined();
        });


        describe('Desktop', () => {

            beforeEach(()=>{
                $scope.model.forceDesktop=true;
                $scope.model.forceMobile=false;
                $scope.$digest();
            });

            it('should in desktop pagination view', () => {
                expect(directiveElem.find('ttmd-pagination-desktop').length).toEqual(1);
            });

            it('the first page number should have active class', () => {
                let firstEl = angular.element(directiveElem.find('md-list-item')[0]);
                let secondEl = angular.element(directiveElem.find('md-list-item')[1]);
                expect(firstEl.hasClass('active')).toEqual(true);
                expect(secondEl.hasClass('active')).toEqual(false);
            });

            it('should have max page number as 64/8=8', () => {
                $scope.totalNumber = 64;
                const pagination = {
                    offset: 1,
                    limits: null,
                    total: $scope.totalNumber,
                    breakpoint: null,
                    forceMobile: false
                };
                $scope.model = new PaginationModel(pagination);
                $scope.model.forceDesktop=true;
                $scope.model.forceMobile=false;
                $scope.$digest();
                let lastEl = angular.element(directiveElem.find('md-list-item')).last();
                expect(lastEl.text().trim()).toEqual("8");
            });

            it('should output the right format of pagination', () => {
                let result = directiveCtrl.printPagination();
                let expected = [1,2,3];
                expect(result).toEqual(expected);

                $scope.totalNumber = 64;
                const pagination = {
                    offset: 1,
                    limits: null,
                    total: $scope.totalNumber,
                    breakpoint: null,
                    forceMobile: false
                };
                $scope.model = new PaginationModel(pagination);
                $scope.model.forceDesktop=true;
                $scope.model.forceMobile=false;
                $scope.$digest();
                let result2 = directiveCtrl.printPagination();
                let expected2 = [1,2,3,4,'...', 8];
                expect(result2).toEqual(expected2);

                let result3 = directiveCtrl.printPagination(7);
                let expected3 = [1,'...', 5,6,7,8];
                expect(result3).toEqual(expected3);

                let result4 = directiveCtrl.printPagination(4);
                let expected4 = [1,'...', 3,4,5 ,'...',8];
                expect(result4).toEqual(expected4);
            });
        });

        function getCompiledElement(b) {

            $scope.totalNumber = 24;
            $scope.list = "all";

            const pagination = {
                listType: $scope.list,
                offset: 1,
                limits: null,
                total: $scope.totalNumber,
                breakpoint: null,
                forceMobile: false
            };
            $scope.model = new PaginationModel(pagination);


            const
                mockParentController = {
                    goMobile() {
                        return b || false;
                    }
                };
            parentElement = angular.element('<div><ttmd-pagination model="model" total-number="totalNumber" list="list"></ttmd-pagination></div>');
            parentElement.data('$ttmdTableController', mockParentController);

            const compiledDirective = $compile(parentElement)($scope)
                .find('ttmd-pagination');
            $scope.$digest();
            return compiledDirective;
        }
    });
};
